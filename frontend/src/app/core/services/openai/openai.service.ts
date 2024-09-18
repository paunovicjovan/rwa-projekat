import { Injectable } from '@angular/core';
import { OpenAI } from "openai"
import { from, Observable } from 'rxjs';
import { apiKeys } from '../../../../environments/apiKeys';

const openai = new OpenAI({apiKey: apiKeys.openai, dangerouslyAllowBrowser: true });

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  constructor() { }

  test(): Observable<any> {
    return from(openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
              role: "user",
              content: "Write a poem about recursion in programming.",
          },
      ],
      max_tokens: 300
    }));
  }
}
