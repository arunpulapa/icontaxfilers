import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject } from '@angular/core';
import { DashboardService } from './services/dashboard.service.ts.service';
import { Subscription } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
 kpis: any = {};
  teamPerf: any[] = [];
  loading = true;

  @ViewChild('paymentsChart') paymentsChartRef!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;
  subs: Subscription[] = [];

  constructor(private svc: DashboardService) {}

  ngAfterViewInit(): void {
    // Load KPIs
    this.subs.push(
      this.svc.getKpis().subscribe(k => (this.kpis = k))
    );

    // Load payments and build chart
    this.subs.push(
      this.svc.getPaymentsLastDays(15).subscribe(data => {
        // small timeout to ensure canvas has been laid out and has width
        setTimeout(() => this.initPaymentsChart(data.labels, data.values), 0);
      })
    );

    // Load team performance and mark finished loading
    this.subs.push(
      this.svc.getTeamPerformance().subscribe(t => {
        this.teamPerf = t;
        // mark loading false after major data is ready
        this.loading = false;
      })
    );
  }

  initPaymentsChart(labels: string[], values: number[]) {
    try {
      if (!this.paymentsChartRef || !this.paymentsChartRef.nativeElement) return;
      const ctx = this.paymentsChartRef.nativeElement.getContext('2d')!;
      if (this.chart) {
        this.chart.destroy();
        this.chart = undefined;
      }

      // create gradient background for nicer look
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(15,43,87,0.55)'); // deep navy
      gradient.addColorStop(1, 'rgba(15,43,87,0.05)');

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Payments (INR)',
              data: values,
              fill: true,
              backgroundColor: gradient,
              borderColor: '#0f2b57',
              pointBackgroundColor: '#0f2b57',
              tension: 0.35,
              pointRadius: 3,
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const v = Number(ctx.raw || 0);
                  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { maxRotation: 0, autoSkip: true }
            },
            y: {
              grid: { color: '#f3f6fb' },
              ticks: {
                callback: (value: any) => {
                  if (value >= 100000) return (value / 1000) + 'k';
                  return value;
                }
              }
            }
          }
        }
      });
    } catch (err) {
      console.error('Chart init failed', err);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    if (this.chart) this.chart.destroy();
  }

  formatCurrency(v: number) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
  }
}
