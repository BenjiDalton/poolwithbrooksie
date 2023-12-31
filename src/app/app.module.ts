import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PhysicsService } from './services/physics.service';
import { GameStateService } from './services/game-state.service';
import { PlayerComponent } from './player/player.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [PhysicsService, GameStateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
