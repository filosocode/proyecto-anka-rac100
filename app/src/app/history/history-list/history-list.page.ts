import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBadge
} from '@ionic/angular/standalone';
import { FormEntry } from '../../shared/models/form.model';
import { StorageService } from '../../shared/services/storage.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.page.html',
  styleUrls: ['./history-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBadge],
})
export class HistoryListPage implements OnInit {
  entries: FormEntry[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit() {
    // RF8: historial de formularios enviados
    this.entries = this.storage.get<FormEntry[]>('history') ?? [];
  }
}
