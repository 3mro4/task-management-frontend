import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // Confirmation dialog before deleting
  confirmDelete(itemName: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title: 'Are you sure?',
      text: `"${itemName}" will be permanently deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6c5ce7',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
  }

  // Success notification after adding
  added(itemName: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: `${itemName} has been created successfully.`,
      confirmButtonColor: '#6c5ce7',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }

  // Success notification after editing
  updated(itemName: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: `${itemName} has been updated successfully.`,
      confirmButtonColor: '#6c5ce7',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }

  // Success notification after deleting
  deleted(itemName: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: `${itemName} has been deleted successfully.`,
      confirmButtonColor: '#6c5ce7',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }

  // Error notification
  error(text: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'error',
      title: 'Something went wrong',
      text,
      confirmButtonColor: '#6c5ce7'
    });
  }
}