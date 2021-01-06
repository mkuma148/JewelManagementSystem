import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatStepperModule} from '@angular/material/stepper';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


const Material = [
   MatButtonModule,
   MatButtonToggleModule,
   MatIconModule,
   MatBadgeModule,
   MatProgressSpinnerModule,
   MatToolbarModule,
   MatSidenavModule,
   MatMenuModule,
   MatCardModule,
   MatFormFieldModule,
   MatListModule,
   MatDividerModule,
   MatInputModule,
   MatChipsModule,
   MatGridListModule,
   MatExpansionModule,
   MatDatepickerModule,
   MatNativeDateModule,
   MatTableModule,
   MatDialogModule,
   MatCheckboxModule,
   MatRadioModule,
   MatSelectModule,
   MatTooltipModule,
   MatStepperModule,
   MatAutocompleteModule,
   MatProgressBarModule,
   MatSnackBarModule,
   MatBottomSheetModule,
   MatPaginatorModule,
   MatSortModule
]

@NgModule({
  declarations: [],
  imports: [Material], 
  exports: [Material]
})
export class MaterialModule { }
