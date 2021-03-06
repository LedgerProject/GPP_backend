// Loopback imports
import { AuthenticationComponent, registerAuthenticationStrategy } from "@loopback/authentication";
import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, createBindingFromClass } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer';
import { ServiceMixin } from '@loopback/service-proxy';
import { CronComponent } from '@loopback/cron';
import multer from "multer";
// Other imports
import path from 'path';
// GPP imports
import { JWTStrategy } from "./authentication-stategies/jwt-strategy";
import { PasswordHasherBindings, TokenServiceBindings, TokenServiceConstants, UserServiceBindings } from './authorization/keys';
import { FILE_UPLOAD_SERVICE, MEMORY_UPLOAD_SERVICE, STORAGE_DIRECTORY } from './keys';
import { MySequence } from './sequence';
import { BcryptHasher } from './services/hash.password.bcrypt';
import { JWTService } from './services/jwt-service';
import { MyUserService } from './services/user.service';
import { MyCronJob } from "./services/cron-service";


export class GPPBackend extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up bindings
    this.setupBinding();

    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this as any, JWTStrategy);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // We need to setup cron jobs
    this.component(CronComponent);

    this.add(createBindingFromClass(MyCronJob));

    // Configure file upload with multer options
    this.configureFileUpload(options.fileStorageDirectory);

    //Configure memory upload
    this.configureMemoryUpload();

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setupBinding(): void {
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

  }

  /**
   * Configure `multer` options for file upload
   */
  protected configureFileUpload(destination?: string) {
    // Upload files to `dist/.sandbox` by default
    destination = destination ?? path.join(__dirname, '../.sandbox');
    this.bind(STORAGE_DIRECTORY).to(destination);
    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination,
        // Use the original file name as is
        filename: (req, file, cb) => {
          cb(null, file.originalname + '-' + Date.now());
        },
      }),
      limits: { fileSize: 8000000 }
    };
    // Configure the file upload service with multer options
    this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
  }

  /**
   * Configure `multer` options for file upload
   */
  protected configureMemoryUpload() {
    const multerOptions: multer.Options = {
      storage: multer.memoryStorage()
    };
    this.configure(MEMORY_UPLOAD_SERVICE).to(multerOptions);
  }
}
