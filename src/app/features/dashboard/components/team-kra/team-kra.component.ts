import { Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';



@Component({
  selector: 'app-team-kra',
  templateUrl: './team-kra.component.html',
  styleUrls: ['./team-kra.component.scss']
})
export class TeamKraComponent {
   @ViewChild('paymentsChart') paymentsChartRef!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  kpis = [
    { label: 'Payments', value: 0, meta: 'Payments received', icon: 'payments', color: 'primary' },
    { label: 'Registrations', value: 0, meta: 'Registrations done', icon: 'person_add', color: 'accent' },
    { label: 'Referrals', value: 0, meta: 'Referrals received', icon: 'share', color: 'primary' },
    { label: 'Completed', value: '0.00%', meta: 'Files completed', icon: 'check_circle', color: 'warn' }
  ];

  ngAfterViewInit(): void {
    const ctx = this.paymentsChartRef.nativeElement.getContext('2d')!;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 15 }, (_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: 'Payments (INR)',
            data: [0, 2, 4, 8, 15, 23], // demo data
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25,118,210,0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true, position: 'top' } }
      }
    });
  }
}
