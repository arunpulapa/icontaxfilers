import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../../../core/models/client.model';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent {
 clientForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      team: [''],
      status: ['active', Validators.required]
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      const newClient: Client = {
        ...this.clientForm.value,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      this.clientService.addClient(newClient);
      this.router.navigate(['/clients']);
    }
  }
}
