import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeType = 'priority' | 'status';

@Component({
  selector: 'app-munazm-badge',
  imports: [CommonModule],
  templateUrl: './munazm-badge.html',
  styleUrl: './munazm-badge.css'
})
export class MunazmBadge {
  @Input() type!: BadgeType;
  @Input() value!: string;

  getClass(): string {
    if (this.type === 'priority') {
      const map: Record<string, string> = {
        LOW: 'badge-low',
        MEDIUM: 'badge-medium',
        HIGH: 'badge-high'
      };
      return map[this.value] ?? 'badge-default';
    }

    if (this.type === 'status') {
      const map: Record<string, string> = {
        TODO: 'badge-todo',
        IN_PROGRESS: 'badge-in-progress',
        DONE: 'badge-done'
      };
      return map[this.value] ?? 'badge-default';
    }

    return 'badge-default';
  }

  getLabel(): string {
    return this.value.replace('_', ' ');
  }
}