import { Injectable } from '@angular/core';
import { OpenAI } from "openai"
import { from, Observable } from 'rxjs';
import { apiKeys } from '../../../../environments/apiKeys';
import { ImagesResponse } from 'openai/resources/images.mjs';
import { ChatCompletion } from 'openai/resources/index.mjs';
import { EnhanceProjectDto } from '../../../features/projects/models/enhance-project-dto.interface';

const openai = new OpenAI({apiKey: apiKeys.openai, dangerouslyAllowBrowser: true });

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  constructor() { }

  enhanceProjectData(oldProjectData: EnhanceProjectDto): Observable<ChatCompletion> {
    return from(openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
          { 
            role: "system", 
            content: "Ti si pomoćnik za poboljšavanje podataka o softverskom projektu. Pišeš na srpskom jeziku, koristeći ekavicu i vraćaš samo ono što se traži." +
                     "Korisnik ti šalje podatke o projektu u vidu JSON objekta sa sledećim formatom: {titles: string[]; description: string; requirements: string | null;}" + 
                     "Tvoj zadatak je da na osnovu dobijenog objekta napraviš objekat sa istim formatom koji ima 3 predložena naslova između 2 i 30 karaktera" + 
                     "novi opis do 300 karaktera koji je sličan starom ali poboljšan, i zahtevi do 300 karaktera koji su poboljšani ili su neki tvoj predlog." + 
                     "Kao odgovor vraćaš isključivo JSON objekat i ništa više."
          },
          {
            role: "user",
            content: JSON.stringify(oldProjectData),
          },
      ],
    }));
  }

  generateImage(imageDescription: string): Observable<ImagesResponse> {
    return from(openai.images.generate({
      model: "dall-e-3",
      prompt: imageDescription,
      n: 1,
      size: "1792x1024",
      response_format: 'b64_json'
    }))
  }
}
