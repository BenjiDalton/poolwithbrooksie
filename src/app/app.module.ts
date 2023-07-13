import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BallComponent } from './ball/ball.component';
import { PhysicsService } from './services/physics.service';

@NgModule({
  declarations: [
    AppComponent,
    BallComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [PhysicsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
