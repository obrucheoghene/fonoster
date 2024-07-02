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
import { GRPCError } from "@fonoster/common";
import { status } from "@grpc/grpc-js";
import { Prisma } from "../core/db";

function makeCheckNumberPreconditions(prisma: Prisma) {
  return async function checkNumberPreconditions({ appRef, accessKeyId }) {
    if (!appRef) {
      // Not needed to check for the precondition
      return;
    }

    const app = await prisma.application.findUnique({
      where: { ref: appRef, accessKeyId }
    });

    if (!app) {
      throw new GRPCError(
        status.NOT_FOUND,
        "Application not found for ref: " + appRef
      );
    }
  };
}

export { makeCheckNumberPreconditions };