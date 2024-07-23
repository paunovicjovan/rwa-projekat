import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenPersistenceService {

  set(key: string, data: unknown): void {
    try{
        localStorage.setItem(key, JSON.stringify(data));
    }
    catch(e) {
        console.error('Greška pri čuvanju u localStorage', e);
    }
  }

  get(key:string): unknown {
    try{
        const localStorageItem = localStorage.getItem(key);
        return localStorageItem ? JSON.parse(localStorageItem) : null;
    }
    catch(e){
        console.error('Greška pri čitanju localStorage', e);
        return null;
    }
  }
}
