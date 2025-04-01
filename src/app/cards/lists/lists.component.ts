import {
  Component,
  OnInit
} from '@angular/core';
import {
  MatDialog
} from '@angular/material/dialog';
import {
  CardPopupComponent
} from '../card-popup/card-popup.component';
import { CreditCard } from 'angular-cc-library';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  cards: any;
  info: any;
  mask: any
  toggle: boolean = false;
  cvvTimeouts: { [key: string]: any } = {};

  constructor(private dialog: MatDialog) {

    this.listCards()

  }

  listCards() {
    this.info = localStorage.getItem("cardDetails");
    this.cards = JSON.parse(this.info) || [];
    // Initialize isActive property if not present
    this.cards = this.cards.map((card: any) => ({
      ...card,
      isActive: card.isActive === undefined ? true : card.isActive,
      isPrimary: card.isPrimary === undefined ? false : card.isPrimary
    }));
    this.saveCards();
  }

  maskData(data: any) {
    const cardnumber = data.replace(/\s/g, ''); // Remove existing spaces
    const first4 = cardnumber.substring(0, 4);
    const last5 = cardnumber.substring(cardnumber.length - 5);
    
    // Calculate number of X's needed (total length - 9)
    const maskLength = cardnumber.length - 9;
    this.mask = 'X'.repeat(maskLength);
    
    const maskedNumber = first4 + this.mask + last5;
    
    // Add space after every 4 digits
    return maskedNumber.replace(/(.{4})/g, '$1 ').trim();
  }

  ngOnInit(): void {}

  actionDialog(action: any) {
    console.log(action)
    const dialogRef = this.dialog.open(CardPopupComponent, {
      panelClass: ['animate__animated', 'animate__slideInRight'],
      disableClose: true,
      autoFocus: false,
      // width: '500px',
      data: {
        text: action,
        yes: 'Yes',
        no: 'OK'
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      this.listCards()
    });
  }

  toggleCvv(card: any) {
    // Clear any existing timeout for this card
    if (this.cvvTimeouts[card.cardNumber]) {
      clearTimeout(this.cvvTimeouts[card.cardNumber]);
    }

    // Toggle CVV visibility
    card.showCvv = !card.showCvv;

    // If CVV is shown, set a timeout to hide it
    if (card.showCvv) {
      this.cvvTimeouts[card.cardNumber] = setTimeout(() => {
        card.showCvv = false;
        // Trigger change detection
        this.cards = [...this.cards];
      }, 5000); // Hide after 5 seconds
    }
  }

  toggleCard(card: any) {
    if (card.isPrimary) {
      return;
    }
    card.isActive = !card.isActive;
    this.saveCards();
  }

  saveCards() {
    localStorage.setItem("cardDetails", JSON.stringify(this.cards));
  }

  getCardType(cardNumber: string): string {
    const type = CreditCard.cardType(cardNumber);
    const baseClass = type?.toLowerCase() || 'unknown';
    const card = this.cards.find((c: any) => c.cardNumber === cardNumber);
    
    let classes = [baseClass];
    
    // Add primary class if card is primary
    if (card?.isPrimary) {
      classes.push('primary');
    }
    // Add inactive class if card is disabled and not primary
    else if (!card?.isActive) {
      classes.push('inactive');
    }
    
    return classes.join(' ');
  }

  getCardLogo(cardNumber: string): string {
    const type = this.getCardType(cardNumber);

    // Remove inactive and primary from the type
    const cleanType = type
      .replace(' inactive', '')
      .replace(' primary', '');
    // Return path to card logo images - adjust path as needed
    return `assets/${cleanType}.png`;
  }

  makePrimary(selectedCard: any) {
    // Remove primary status from all other cards
    this.cards.forEach((card: any) => {
      if (card.cardNumber !== selectedCard.cardNumber) {
        card.isPrimary = false;
      }
    });

    // Make the selected card primary and ensure it's active
    selectedCard.isPrimary = true;
    selectedCard.isActive = true;

    this.saveCards();
  }
}












