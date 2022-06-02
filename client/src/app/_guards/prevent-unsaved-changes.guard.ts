import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {
  canDeactivate(component: unknown): boolean {
    return true;
    // add if component is ready
    // if (component.editForm.dirty) {
    //   return confirm('Are you sure you want to continue? Any unsaved changes will be lost');
    // }
    // return true;
    // also add in component.ts
    // @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    //  if (this.editForm.dirty) {$event.returnValue = true}
    // }
  }
  
}
