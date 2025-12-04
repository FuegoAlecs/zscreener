import pool from '../config/database.js';
import crypto from 'crypto';

export class DemoGenerator {
  private interval: NodeJS.Timeout | null = null;

  start(intervalMs: number = 10000) {
    console.log('🚀 Starting Demo Mode: Live Transaction Generator');
    this.interval = setInterval(() => this.generateTransaction(), intervalMs);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }

  private async generateTransaction() {
    try {
      const isShielded = Math.random() > 0.3;
      // const amount = (Math.random() * 100).toFixed(4); // Unused for now

      // Generate random hex strings for realism
      const txHash = crypto.randomBytes(32).toString('hex');
      const blockHeight = 2500000 + Math.floor(Math.random() * 1000); // Fake height near tip

      await pool.query(`
        INSERT INTO shielded_transactions (
          tx_hash,
          block_height,
          timestamp,
          shielded_inputs,
          shielded_outputs,
          memo_data
        )
        VALUES ($1, $2, NOW(), $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [
        txHash,
        blockHeight,
        isShielded ? Math.floor(Math.random() * 5) : 0,
        isShielded ? Math.floor(Math.random() * 5) : 0,
        isShielded ? `Demo Memo: Payment for order #${Math.floor(Math.random() * 9000)}` : null
      ]);

      // console.log(`[Demo] Generated tx: ${txHash.substring(0, 8)}... ($${amount})`);
    } catch (error) {
      console.error('[Demo] Generator error:', error);
    }
  }
}

export const demoGenerator = new DemoGenerator();
