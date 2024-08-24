/*
 * Copyright (C) 2024 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * This file is part of Fonoster
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  StartStreamRequest,
  StreamAudioFormat,
  StreamDirection,
  StreamMessageType
} from "@fonoster/common";
import { z } from "zod";
import { withErrorHandling } from "./utils/withErrorHandling";
import { VoiceClient } from "../types";

const streamRequestSchema = z.object({
  direction: z.nativeEnum(StreamDirection).optional(),
  format: z.nativeEnum(StreamAudioFormat).optional()
});

function streamHandler(voiceClient: VoiceClient) {
  return withErrorHandling(async (request: StartStreamRequest) => {
    const { sessionRef, direction, format } = request;

    // Error handled by withErrorHandling
    streamRequestSchema.parse(request);

    const effectiveDirection = direction || StreamDirection.BOTH;
    const effectiveFormat = format || StreamAudioFormat.WAV;

    // FIXME: Implement stream IN and correct streamRef
    if (
      effectiveDirection.includes(StreamDirection.OUT) ||
      effectiveDirection === StreamDirection.BOTH
    ) {
      voiceClient.getTranscriptionsStream().on("data", (data) => {
        voiceClient.sendResponse({
          streamPayload: {
            sessionRef,
            type: StreamMessageType.AUDIO_OUT,
            data,
            streamRef: "fixme",
            format: effectiveFormat
          }
        });
      });
    }

    voiceClient.sendResponse({
      startStreamResponse: {
        sessionRef,
        streamRef: "fixme"
      }
    });
  });
}

export { streamHandler };