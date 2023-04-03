import { Command, CommandRunner, Option } from 'nest-commander';
import AppSeedFactory from './factory/app.fatory';

interface SeedCommandOptions {
  class?: string;
}

@Command({ name: 'seed', description: 'Seeder' })
export class SeedCmd implements CommandRunner {
  async run(
    passedParam: string[],
    options?: SeedCommandOptions,
  ): Promise<void> {
    const seedClass = options.class;
    if (!seedClass) {
      console.info('Seed class null!');
      return;
    }
    const appSeeder = new AppSeedFactory();
    await appSeeder.run(seedClass);
  }

  @Option({
    flags: '--class [string]',
    description: 'class name (not word "seed")',
  })
  parseFrom(val: string): string {
    return val;
  }
}
