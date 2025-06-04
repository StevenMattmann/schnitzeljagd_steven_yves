import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private startTime: number | null = null;
  private playerName: string | null = null;
  private leaderboardData: { name: string; date: string; schnitzel: number; potatoes: number }[] = [];
  private schnitzelCount = 0;
  private kartoffelCount = 0;

  constructor() {

  }

  async startSessionForPlayer(name: string, date: string) {
    this.playerName = name;
    this.startTime = Date.now();
    console.log(`Starting session for player: ${name} on ${date}`);

    const existingPlayer = this.leaderboardData.find(entry => entry.name === name);
    if (!existingPlayer) {
      console.log(`New player added: ${name}`);
      this.leaderboardData.push({ name, date, schnitzel: 0, potatoes: 0 });
      await this.saveLeaderboardData();
    }
  }

  async addTask(taskName: string, time: number) {
    const schnitzel = 1;
    const potatoes = time > 20000 ? 1 : 0;

    this.schnitzelCount += schnitzel;
    this.kartoffelCount += potatoes;

    console.log(`Task added : ${taskName}, Time: ${time}ms, Schnitzel: ${schnitzel}, Potatoes: ${potatoes}`);

    if (this.playerName) {
      const playerEntry = this.leaderboardData.find(entry => entry.name === this.playerName);
      if (playerEntry) {
        console.log(`Updating player ${this.playerName}: Before:`, playerEntry);
        playerEntry.schnitzel += schnitzel;
        playerEntry.potatoes += potatoes;
        console.log(`Updating player ${this.playerName}: After:`, playerEntry);
        await this.saveLeaderboardData();
      } else {
        console.error(`Player ${this.playerName} not found in leaderboard`);
      }
    }
  }

  getTotalSchnitzel(): number {
    return this.schnitzelCount;
  }

  getTotalKartoffeln(): number {
    return this.kartoffelCount;
  }

  getLeaderboardData() {
    console.log('Leaderboard data retrieved:', this.leaderboardData);
    return this.leaderboardData;
  }

  getTotalTime(): number {
    if (this.startTime) {
      return Date.now() - this.startTime;
    }
    return 0;
  }

  reset() {
    this.startTime = null;
    this.playerName = null;
    this.leaderboardData = [];
    this.schnitzelCount = 0;
    this.kartoffelCount = 0;
    console.log('Tracking service reset');
  }

  public async saveLeaderboardData() {
    try {
      console.log('Saving leaderboard data:', this.leaderboardData);
      await Preferences.set({
        key: 'leaderboardData',
        value: JSON.stringify(this.leaderboardData),
      });
      console.log('Leaderboard data saved successfully.');
    } catch (error) {
      console.error('Error saving leaderboard data:', error);
    }
  }

  public async loadLeaderboardData() {
    try {
      const { value } = await Preferences.get({ key: 'leaderboardData' });
      if (value) {
        this.leaderboardData = JSON.parse(value);
        console.log('Leaderboard data loaded successfully:', this.leaderboardData);
      } else {
        console.log('No saved leaderboard data found. Initializing with empty array.');
        this.leaderboardData = [];
      }
    } catch (error) {
      console.error('Error loading leaderboard data:', error);
      this.leaderboardData = [];
    }
  }
}
