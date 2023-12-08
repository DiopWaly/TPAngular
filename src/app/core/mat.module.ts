import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
@NgModule({
    declarations:[

    ],
    imports:[
        MatIconModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatTableModule,
        MatPaginatorModule,
    ],
    exports:[
        MatIconModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatTableModule,
        MatPaginatorModule,
    ]
})
export class MatModule{}