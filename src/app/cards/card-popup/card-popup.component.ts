import {
  Component,
  HostListener,
  Inject,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {
  CreditCardValidators
} from './CreditCardValidators';
import {
  CreditCard
} from 'angular-cc-library';
import {
  defer
} from 'rxjs';
import {
  map
} from 'rxjs/operators';
import {
  CardService
} from 'src/app/card.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-card-popup',
  templateUrl: './card-popup.component.html',
  styleUrls: ['./card-popup.component.scss']
})
export class CardPopupComponent implements OnInit {
  spinner: boolean = false
  cardDetailsForm!: FormGroup;
  submitted: boolean = false;

  array: Array < any > = []

  months = [
    { month: '01' }, { month: '02' }, { month: '03' }, { month: '04' },
    { month: '05' }, { month: '06' }, { month: '07' }, { month: '08' },
    { month: '09' }, { month: '10' }, { month: '11' }, { month: '12' }
  ];

  years = Array.from({length: 20}, (_, i) => ({
    year: (new Date().getFullYear() + i).toString()
  }));

  types = defer(() => this.cardDetailsForm.get('creditCard')?.valueChanges)
  .pipe(map((num: string) => CreditCard.cardType(num)));
  cardType: any;
  data: any;
  validateCard: boolean = false;

  getCardType(cardNumber: string): string {
    return CreditCard.cardType(cardNumber) || '';
  }

  getCardLogo(cardNumber: string): string {
    const type = this.getCardType(cardNumber);
    // Map card types to image names
    const imageMap: { [key: string]: string } = {
      'visa': 'visa.png',
      'mastercard': 'mastercard.png',
      'amex': 'amex.png',
      'discover': 'discover.png',
      'jcb': 'jcb.png',
      'dinersclub': 'dinersclub.png',
      'maestro': 'maestro.png',
      'unionpay': 'unionpay.png',
      'unknown': 'generic.png',
      'dk' : 'dk.png'
    };
    
    return `assets/${imageMap[type] || 'generic.png'}`;
  }

  maskData(cardNumber: string): string {
    const first4 = cardNumber.substring(0, 4);
    const last5 = cardNumber.substring(cardNumber.length - 5);
    const mask = cardNumber.substring(4, cardNumber.length - 5).replace(/\d/g, "X");
    return first4 + mask + last5;
  }

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar , public dialogRef: MatDialogRef < CardPopupComponent > , private cardService: CardService,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.cardType = cardService.CardDefinition

    this.data = data

  }

  ngOnInit() {
    this.cardDetailsForm = this.fb.group({
      cardHolder: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]*$/), 
        Validators.maxLength(50)
      ]],
      creditCard: ['', [
        Validators.required,
        Validators.maxLength(19),
        CreditCardValidators.validateCCNumber
      ]],
      expMonth: ['', [Validators.required]],
      expYear: ['', [Validators.required]],
      cvv: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(4),
        Validators.pattern('^[0-9]*$') // Add pattern validator for numbers only
      ]],
    });

    // Subscribe to credit card value changes
    this.cardDetailsForm.get('creditCard')?.valueChanges.subscribe(value => {
      if (!value) {
        this.cardType = '';
        const input = document.querySelector('input[formControlName="creditCard"]') as HTMLElement;
        if (input) {
          input.classList.remove('valid-card', 'invalid-card');
        }
      }
    });
  }
  onNoClick(): void {
    // Properly reset form before closing
    if (this.cardDetailsForm) {
      this.cardDetailsForm.reset();
      Object.keys(this.cardDetailsForm.controls).forEach(key => {
        const control = this.cardDetailsForm.get(key);
        control?.setErrors(null);
        control?.markAsUntouched();
        control?.markAsPristine();
      });
    }
    this.dialogRef.close();
  }

  checkCard(event: any) {
    const input = event.target;
    const cardNumber = input.value.replace(/\s+/g, '');
    const card = CreditCard.cardFromNumber(cardNumber);
    
    // Get the control
    const control = this.cardDetailsForm.get('creditCard');
    
    // Always mark as touched to ensure validation state is shown
    control?.markAsTouched();

    if (card && this.validateCardNumber(cardNumber)) {
      this.cardType = card.type;
      input.classList.add('valid-card');
      input.classList.remove('invalid-card');
      
      // Clear errors and update validity
      control?.setErrors(null);
      control?.updateValueAndValidity();
    } else {
      this.cardType = '';
      input.classList.add('invalid-card');
      input.classList.remove('valid-card');
      
      // Set error and update validity
      control?.setErrors({ 'invalidCard': true });
      control?.updateValueAndValidity();
    }
  }

  getCardErrorMessage(): string {
    const control = this.cardDetailsForm.get('creditCard');
    if (!control?.errors) return '';

    const cardNumber = (control.value || '').replace(/\s+/g, '');

    if (cardNumber.length === 0) {
      return 'Card number is required';
    }

    const card = CreditCard.cardFromNumber(cardNumber);
    if (!card) {
      return 'Invalid card number';
    }

    if (!this.validateCardNumber(cardNumber)) {
      return 'Invalid card number';
    }

    return '';
  }

  get cardDetails() {
    return this.cardDetailsForm.controls;
  }

  goToNextField(controlName: string, nextField: HTMLInputElement) {
    controlName.split(/[\s\/]+/, 2);
    if (this.cardDetailsForm.get(controlName)?.valid) {
      nextField.focus();
    }
  }

  addCard(cardDetails: any) {
    const cardNumber = cardDetails.creditCard.replace(/\s+/g, '');
    const existingCards = JSON.parse(localStorage.getItem('cardDetails') || '[]');
    
    // Check if card already exists
    if (existingCards.some((card: any) => card.cardNumber.replace(/\s+/g, '') === cardNumber)) {
      this._snackBar.open("This card already exists", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      
      // Properly reset the form and its validation states
      this.cardDetailsForm.reset();
      Object.keys(this.cardDetailsForm.controls).forEach(key => {
        const control = this.cardDetailsForm.get(key);
        control?.setErrors(null);
        control?.markAsUntouched();
        control?.markAsPristine();
      });
      
      // Remove validation classes from the credit card input
      const creditCardInput = document.querySelector('input[formControlName="creditCard"]');
      if (creditCardInput) {
        creditCardInput.classList.remove('valid-card', 'invalid-card');
      }
      
      return;
    }

    const cardobj = {
      cardNumber: cardDetails.creditCard,
      expMonth: cardDetails.expiryMonth,
      expYear: cardDetails.expiryYear,
      cvv: cardDetails.cvv,
      cardHolder: cardDetails.cardHolder,
      isPrimary: existingCards.length === 0
    };
    
    existingCards.push(cardobj);
    localStorage.setItem('cardDetails', JSON.stringify(existingCards));
    
    this._snackBar.open("Card has been added to the list", "Close", {
      duration: 1000,
    });

    this.onNoClick();
  }


  deleteCard(card: any) {
    let cardobj = {
      cardNumber: this.data.text.cardNumber,
      expMonth: this.data.text.expMonth,
      expYear: this.data.text.expYear,
      cvv: this.data.text.cvv,
      cardHolder: this.data.text.cardHolder,
      isPrimary: this.data.text.isPrimary
    }

    var cardDetails = JSON.parse(localStorage.getItem('cardDetails') || '[]')

    this.onNoClick()
    
    
    for (let i = 0; i < cardDetails.length; i ++) {
      if (cardDetails[i].cardNumber === this.data.text.cardNumber) {

        cardDetails.splice(i, 1)
        localStorage.setItem('cardDetails', JSON.stringify(cardDetails))
        this._snackBar.open("Card has been Delete from the List", "Close" , {
          duration:  1000,
        });
        this.onNoClick()
      
        return
      } 
    
    }
   
  }

  @HostListener('input', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    
    if (input.getAttribute('formControlName') === 'creditCard') {
      let trimmed = input.value.replace(/\s+/g, '');
      
      // Enforce maximum length of 19 digits
      if (trimmed.length > 19) {
        trimmed = trimmed.substr(0, 19);
      }

      // Format the number with spaces
      let numbers = [];
      for (let i = 0; i < trimmed.length; i += 4) {
        numbers.push(trimmed.substr(i, 4));
      }

      input.value = numbers.join(' ');
      
      // Trigger validation
      this.checkCard(event);
    }
  }

  validateCardNumber(cardNumber: string): boolean {
    const trimmed = cardNumber.replace(/\s+/g, '');
    const card = CreditCard.cardFromNumber(trimmed);
    
    if (!card) {
      return false;
    }

    // Check if length is valid for this card type
    if (!card.length.includes(trimmed.length)) {
      return false;
    }

    // Additional validation based on card type
    switch (card.type) {
      case 'visa':
        return /^4\d{12}(\d{3})?(\d{3})?$/.test(trimmed); // 13, 16, or 19 digits
      case 'mastercard':
        return /^(5[1-5]|2[2-7])\d{14}$/.test(trimmed); // 16 digits
      case 'amex':
        return /^3[47]\d{13}$/.test(trimmed); // 15 digits
      case 'dinersclub':
        return /^3(0[0-5]|[68]\d)\d{11}$/.test(trimmed); // 14 digits
      case 'discover':
        return /^6(?:011|5\d{2}|4[4-9]\d)\d{12}$/.test(trimmed); // 16 digits
      case 'jcb':
        return /^35\d{14}$/.test(trimmed); // 16 digits
      case 'maestro':
        return /^(5018|5020|5038|6304|6759|676[1-3])\d{8,15}$/.test(trimmed); // 12-19 digits
      default:
        return card.length.includes(trimmed.length);
    }
  }

  onSubmit(formValue: any, types: any) {
    this.submitted = true;
    if (this.cardDetailsForm.valid) {
      // Create card details object
      const cardDetails = {
        creditCard: formValue.creditCard.replace(/\s+/g, ''),
        expiryMonth: formValue.expMonth,
        expiryYear: formValue.expYear,
        cvv: formValue.cvv,
        cardHolder: formValue.cardHolder
      };

      this.addCard(cardDetails);
      
    }
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    // Allow: backspace, delete, tab, escape, enter
    if ([46, 8, 9, 27, 13].indexOf(event.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (event.keyCode === 65 && event.ctrlKey === true) ||
      // Allow: Ctrl+C
      (event.keyCode === 67 && event.ctrlKey === true) ||
      // Allow: Ctrl+V
      (event.keyCode === 86 && event.ctrlKey === true) ||
      // Allow: Ctrl+X
      (event.keyCode === 88 && event.ctrlKey === true) ||
      // Allow: home, end, left, right
      (event.keyCode >= 35 && event.keyCode <= 39)) {
      return true;
    }
    
    // Allow only numbers
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) &&
        (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = event.clipboardData?.getData('text/plain').replace(/\D/g, '') || '';
    const cvvControl = this.cardDetailsForm.get('cvv');
    if (cvvControl) {
      cvvControl.setValue(pastedInput.substring(0, 4)); // Limit to 4 digits
    }
  }

  // Add this method to handle form reset
  resetForm() {
    // First reset the form values
    this.cardDetailsForm.reset({
      cardHolder: '',
      creditCard: '',
      expMonth: '',
      expYear: '',
      cvv: ''
    });

    // Reset validation states
    Object.keys(this.cardDetailsForm.controls).forEach(key => {
      const control = this.cardDetailsForm.get(key);
      if (control) {
        control.setErrors(null);
        control.markAsUntouched();
        control.markAsPristine();
        control.updateValueAndValidity();
      }
    });
    
    // Reset card type and validation classes
    this.cardType = '';
    const creditCardInput = document.querySelector('input[formControlName="creditCard"]') as HTMLElement;
    if (creditCardInput) {
      creditCardInput.classList.remove('valid-card', 'invalid-card');
    }
    
    // Reset form state
    this.submitted = false;
    this.cardDetailsForm.updateValueAndValidity();
  }
}








