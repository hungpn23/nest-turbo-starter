import { hashData, Role } from '@app/common';
import { EntityManager } from '@mikro-orm/core';
import chalk from 'chalk';
import { Command, CommandRunner, InquirerService, Option } from 'nest-commander';
import { UserRepository } from 'src/data-access/user';
import { commandConstants, questionConstants } from './command.constant';

@Command({
  name: commandConstants.createAdmin,
  description: 'Create a system admin',
  arguments: '[email] [password]',
})
export class CreateAdminCommand extends CommandRunner {
  constructor(
    private readonly inquirer: InquirerService,
    private readonly userRepo: UserRepository,
    private readonly em: EntityManager,
  ) {
    super();
  }

  async run(): Promise<void> {
    const answers = await this.inquirer.prompt<{
      email: string;
      password: string;
    }>(questionConstants.createAdmin, undefined);
    const email = answers.email.trim();
    const pass = answers.password.trim();

    // TODO
    /*const adminRole = await this.roleRepo.findOneBy({ code: Roles.ADMIN });
    if (!adminRole) {
      console.lo
      g(chalk.green('CreateAdminCommand Error: Admin role not found.'));
      throw new Error();
    }*/

    const hasAccount = await this.userRepo.findOne({ email });
    if (hasAccount) {
      console.log(chalk.red('CreateAdminCommand Error: Email already exist.'));
      return;
    }

    // Password hashing
    const passwordHash = await hashData(pass);
    try {
      const userData = {
        email: email,
        password: passwordHash,
        isActive: true,
        emailVerified: true,
        role: Role.Admin,
      };
      const newAdmin = this.userRepo.create(userData);
      await this.em.persistAndFlush(newAdmin);
      console.log(chalk.green('Create admin successfully.'));
    } catch (err) {
      console.log(chalk.green('CreateAdminCommand Error: '), err);
    }
  }

  @Option({
    flags: '-s, --shell <shell>',
  })
  parseShell(val: string) {
    return val;
  }
}
