import { Injectable } from '@angular/core';
import { OpenAI } from "openai"
import { from, Observable } from 'rxjs';
import { apiKeys } from '../../../../environments/apiKeys';
import { ImagesResponse } from 'openai/resources/images.mjs';

const openai = new OpenAI({apiKey: apiKeys.openai, dangerouslyAllowBrowser: true });

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

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

  generateImage(imageDescription: string): Observable<ImagesResponse> {
    return from(openai.images.generate({
      model: "dall-e-2",
      prompt: imageDescription,
      n: 1,
      size: "256x256",
      response_format: 'b64_json'
    }))
  }
}
