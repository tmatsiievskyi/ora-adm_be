import { TConfig, TContainer, TParseReq, TSignUpBody } from '@common/types';
import { CreateUserInput, LoginUserInput } from '../auth';
import { UserService } from '../users/user.service';
import {
  AuthException,
  BadRequest,
  HttpException,
  NotFoundException,
} from '@common/exceptions';

export class AuthService {
  private readonly userService: UserService;

  constructor(
    private readonly container: TContainer,
    private readonly config: TConfig['tokens'],
  ) {
    this.userService = new UserService(this.container);
  }

  public async handleSignIn(data: LoginUserInput['body']) {
    const { login, password } = data;

    const user = await this.userService.findByLogin({ login });
    if (!user) throw new AuthException();

    const passwordMatch = await this.container.crypting.comparePasswords(
      user.password,
      password,
    );
    if (!passwordMatch) throw new AuthException();

    return await this.generateAuthTokens(login);
  }

  public async handleSignUp(data: CreateUserInput['body'] | null) {
    if (!data) {
      throw new BadRequest('Body is not provided');
    }

    const { login, password } = data;
    if (!login || !password) {
      throw new BadRequest('Login or Email is not provided');
    }

    const userExists = await this.userService.findByLogin({ login });
    if (userExists) {
      throw new BadRequest('User with this login already exists');
    }

    const hashedPassword = await this.container.crypting.hashPassword(password);
    const createdUser = await this.userService.createUser({
      login,
      password: hashedPassword,
    });

    return createdUser;
  }

  public async generateAuthTokens(login: string) {
    return await Promise.all([
      this.container.jwt.generateJwt(
        { login, type: 'access' },
        this.config.access.secret,
        {
          expiresIn: Number(this.config.access.expires),
        },
      ),
      this.container.jwt.generateJwt(
        { login, type: 'refresh' },
        this.config.refresh.secret,
        {
          expiresIn: Number(this.config.refresh.expires),
        },
      ),
    ]);
  }
}
