import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card-blur',
  imports: [],
  templateUrl: './card-blur.component.html',
  styleUrl: './card-blur.component.css',
})
export class CardBlurComponent {
  public text = input.required<string>();
}
