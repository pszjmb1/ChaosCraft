// lib/supabase/dev-toolkit.ts
import { execSync } from 'child_process';
import { createHash, Hash } from 'crypto';
import fs from 'fs';
import path from 'path';

/**
 * Configuration options for the development toolkit
 */
interface ToolkitConfig {
  cacheDir: string;
  schemaFiles: string[];
  parallelOperations: boolean;
  verboseOutput: boolean;
}

/**
 * Options for database reset operations
 */
interface ResetOptions {
  force?: boolean;
  preserveData?: boolean;
  skipSeed?: boolean;
  snapshotName?: string;
}

/**
 * @class SupabaseDevKit
 * Development toolkit for optimising Supabase workflows
 */
export class SupabaseDevKit {
  private config: ToolkitConfig;
  private schemaHash: string;

  constructor(config: Partial<ToolkitConfig> = {}) {
    this.config = {
      cacheDir: path.join(process.cwd(), '.supabase/cache'),
      schemaFiles: [
        'supabase/migrations',
        'supabase/seed.sql',
        'supabase/config.toml'
      ],
      parallelOperations: true,
      verboseOutput: false,
      ...config
    };

    this.ensureCacheDir();
    this.schemaHash = this.calculateSchemaHash();
  }

  /**
   * Fast database reset with intelligent caching
   */
  async fastReset(options: ResetOptions = {}): Promise<void> {
    const startTime = Date.now();
    const {
      force = false,
      preserveData = false,
      skipSeed = false,
      snapshotName = 'dev-snapshot'
    } = options;

    this.log('Starting optimised database reset...');

    try {
      if (!force && this.hasValidCache() && !preserveData) {
        this.log('Using cached schema snapshot...');
        this.executeCommand(`supabase db reset --snapshot-file ${this.getCachePath()}`);
      } else {
        this.log('Performing full reset...');
        const commands = [
          'supabase db reset',
          skipSeed ? '--skip-seed' : '',
          preserveData ? '--preserve-data' : ''
        ].filter(Boolean);

        this.executeCommand(commands.join(' '));

        // Cache the new state if not preserving data
        if (!preserveData) {
          this.log('Caching new schema state...');
          this.executeCommand(`supabase db dump --file ${this.getCachePath()}`);
        }
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      this.log(`Reset completed in ${duration}s`);

    } catch (error) {
      this.handleError('Reset failed', error);
      throw error;
    }
  }

  /**
   * Optimise database performance for development
   */
  async optimiseForDev(): Promise<void> {
    const queries = [
      'ALTER SYSTEM SET synchronous_commit = off;',
      'ALTER SYSTEM SET fsync = off;',
      'ALTER SYSTEM SET full_page_writes = off;',
      'ALTER SYSTEM SET work_mem = "16MB";',
      'ALTER SYSTEM SET maintenance_work_mem = "256MB";',
      'ALTER SYSTEM SET random_page_cost = 1.1;',
      'VACUUM ANALYZE;'
    ];

    try {
      this.log('Applying development optimisations...');
      for (const query of queries) {
        this.executeCommand(`supabase db reset "${query}"`);
      }
      this.log('Development optimisations applied');
    } catch (error) {
      this.handleError('Optimisation failed', error);
      throw error;
    }
  }

  /**
   * Clean development environment
   */
  async cleanEnvironment(): Promise<void> {
    try {
      this.log('Cleaning development environment...');
      this.executeCommand('supabase stop');
      this.executeCommand('docker system prune -f');
      this.log('Environment cleaned');
    } catch (error) {
      this.handleError('Clean failed', error);
      throw error;
    }
  }

  private ensureCacheDir(): void {
    if (!fs.existsSync(this.config.cacheDir)) {
      fs.mkdirSync(this.config.cacheDir, { recursive: true });
    }
  }

  private calculateSchemaHash(): string {
    const hash = createHash('sha256');
    
    for (const file of this.config.schemaFiles) {
      const fullPath = path.join(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        if (fs.statSync(fullPath).isDirectory()) {
          this.hashDirectory(fullPath, hash);
        } else {
          hash.update(fs.readFileSync(fullPath));
        }
      }
    }

    return hash.digest('hex');
  }

  private hashDirectory(dir: string, hash: Hash): void {
    const files = fs.readdirSync(dir).sort();
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.hashDirectory(fullPath, hash);
      } else {
        hash.update(fs.readFileSync(fullPath));
      }
    }
  }

  private getCachePath(): string {
    return path.join(this.config.cacheDir, `${this.schemaHash}.dump`);
  }

  private hasValidCache(): boolean {
    const cachePath = this.getCachePath();
    return fs.existsSync(cachePath);
  }

  private executeCommand(command: string): void {
    try {
      execSync(command, {
        stdio: this.config.verboseOutput ? 'inherit' : 'pipe'
      });
    } catch (error) {
      this.handleError(`Command failed: ${command}`, error);
      throw error;
    }
  }

  private log(message: string): void {
    if (this.config.verboseOutput) {
      console.log(`[SupabaseDevKit] ${message}`);
    }
  }

  private handleError(context: string, error: unknown): void {
    console.error(`[SupabaseDevKit] ${context}:`, error);
  }
}

// Export singleton instance with default configuration
export const supabaseDevKit = new SupabaseDevKit();