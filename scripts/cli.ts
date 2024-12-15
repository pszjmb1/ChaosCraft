import { Command } from 'commander';
import { supabaseDevKit } from '../lib/supabase/dev-toolkit';

const program = new Command();

program
  .name('supabase-dev')
  .description('Optimised Supabase development tools')
  .version('1.0.0');

program
  .command('reset')
  .description('Fast database reset with caching')
  .option('-f, --force', 'Force full reset ignoring cache')
  .option('-p, --preserve-data', 'Preserve existing data')
  .option('-s, --skip-seed', 'Skip seed data')
  .option('-n, --snapshot-name <name>', 'Custom snapshot name')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options) => {
    if (options.verbose) {
      console.time('Reset Duration');
    }

    try {
      await supabaseDevKit.fastReset(options);
    } catch (error) {
      console.error('Reset failed:', error);
      process.exit(1);
    }

    if (options.verbose) {
      console.timeEnd('Reset Duration');
    }
  });

program
  .command('optimise')
  .description('Apply development optimisations')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options) => {
    try {
      await supabaseDevKit.optimiseForDev();
    } catch (error) {
      console.error('Optimisation failed:', error);
      process.exit(1);
    }
  });

program
  .command('clean')
  .description('Clean development environment')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options) => {
    try {
      await supabaseDevKit.cleanEnvironment();
    } catch (error) {
      console.error('Clean failed:', error);
      process.exit(1);
    }
  });

program.parse();