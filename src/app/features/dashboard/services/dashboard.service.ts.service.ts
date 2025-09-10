import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor() {}

  // KPIs (mock)
  getKpis(): Observable<{
    paymentsYesterday: number;
    registrationsYesterday: number;
    referralsYesterday: number;
    completedToday: number;
  }> {
    const mock = {
      paymentsYesterday: 125000, // rupees
      registrationsYesterday: 18,
      referralsYesterday: 3,
      completedToday: 12
    };
    return of(mock).pipe(delay(250));
  }

  // Payments for last N days - returns labels and values
  getPaymentsLastDays(days = 15): Observable<{ labels: string[]; values: number[] }> {
    const labels: string[] = [];
    const values: number[] = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
      // generate mock payment amount between 20k - 200k
      values.push(Math.round(20000 + Math.random() * 180000));
    }
    return of({ labels, values }).pipe(delay(300));
  }

  // quick stats for team performance (mock)
  getTeamPerformance(): Observable<{ name: string; value: number }[]> {
    const data = [
      { name: 'Team A', value: 124 },
      { name: 'Team B', value: 98 },
      { name: 'Team C', value: 72 }
    ];
    return of(data).pipe(delay(200));
  }
}
