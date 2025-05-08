import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private passwordResetTokens: Map<string, { email: string; expiresAt: Date }> = new Map();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, senha: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return null;
    }

    // Atualizar último acesso
    await this.usersService.updateLastAccess(user.id);

    // Remover a senha do objeto retornado
    const { senha: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.senha);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Gerar token de redefinição de senha
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Definir expiração (1 hora)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Armazenar token (em produção, isso seria armazenado no banco de dados)
    this.passwordResetTokens.set(token, { email, expiresAt });

    // Em um ambiente real, enviaríamos um email com o link de redefinição de senha
    // contendo o token. Para este exemplo, apenas retornamos o token.
    return { message: 'Email de redefinição de senha enviado', token };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, senha } = resetPasswordDto;
    
    // Verificar se o token existe e é válido
    const resetInfo = this.passwordResetTokens.get(token);
    if (!resetInfo) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    // Verificar se o token expirou
    if (new Date() > resetInfo.expiresAt) {
      this.passwordResetTokens.delete(token);
      throw new UnauthorizedException('Token expirado');
    }

    // Buscar o usuário
    const user = await this.usersService.findByEmail(resetInfo.email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Atualizar a senha
    await this.usersService.update(user.id, { senha });

    // Remover o token usado
    this.passwordResetTokens.delete(token);

    return { message: 'Senha redefinida com sucesso' };
  }

  async logout(userId: string) {
    // Em um sistema real com tokens de refresh, aqui invalidaríamos o token
    // Para JWT simples, o logout é gerenciado pelo cliente removendo o token
    return { message: 'Logout realizado com sucesso' };
  }
}