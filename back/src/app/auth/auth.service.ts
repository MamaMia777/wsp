import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Auth, google } from 'googleapis';
import { JwtService } from 'src/common/jwt/jwt.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  private readonly oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {
    this.oauthClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_SECRET,
      'http://localhost:3000/auth/google/callback',
      // 'https://wsp.company/auth/google/callback',
    );
  }

  public async getMe(email: string): Promise<any> {
    return this.databaseService.user.findUnique({ where: { email } });
  }
  public async login(code: string): Promise<any> {
    try {
      const { tokens } = await this.oauthClient.getToken(code);
      const data = await this.oauthClient.getTokenInfo(tokens.access_token);
      if (!data) throw new InternalServerErrorException();
      const profileData = await this.getGoogleProfile(tokens.access_token);

      const userProfile = {
        id: profileData.id,
        name: `${profileData.given_name} ${profileData.family_name}`,
        email: profileData.email,
        photo: profileData.picture,
      };

      console.log(userProfile);

      const userFound = await this.databaseService.user.findUnique({
        where: { email: userProfile.email },
      });
      if (userFound) {
        await this.databaseService.user.update({
          where: { email: userProfile.email },
          data: {
            imageUrl: userProfile?.photo ?? '',
          },
        });
        return this.jwtService.generateToken(userFound, '1y');
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Error while login');
    }
  }

  private async getGoogleProfile(token: string) {
    const userInfo = google.oauth2('v2').userinfo;
    this.oauthClient.setCredentials({
      access_token: token,
    });
    const userInfoResponse = await userInfo.get({
      auth: this.oauthClient,
    });
    return userInfoResponse.data;
  }

  public async getAuthUrl(): Promise<string> {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];
    return this.oauthClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
      // redirect_uri: 'http://localhost:3000/auth/google/callback',
      redirect_uri: 'https://wsp.company/auth/google/callback',
    });
  }
}
