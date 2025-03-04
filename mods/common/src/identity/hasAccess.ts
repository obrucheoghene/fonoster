/*
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
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
import { Access, Role } from "./types";
import { roles } from "./roles";

// This function only checks if the role has access to the grpc method
function hasAccess(access: Access[], method: string) {
  const roleList = access.map((a: Access) => a.role);

  return roleList.some((r: string) =>
    roles.find((role: Role) => role.name === r && role.access.includes(method))
  );
}

export { hasAccess };
