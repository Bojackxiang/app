import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './element/header/header.component';
import { FooterComponent } from './element/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { SlideshowComponent } from './element/slideshow/slideshow.component';
import { SlideShowComponent } from './element/slide-show/slide-show.component';


const theRoutes: Routes = [
  {path:'home', component: HomeComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SlideshowComponent,
    SlideShowComponent,
    
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(theRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
