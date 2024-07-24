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
  Application,
  BaseApiObject,
  CreateApplicationRequest,
  CreateApplicationResponse,
  GetApplicationRequest,
  ListApplicationsRequest,
  ListApplicationsResponse,
  UpdateApplicationRequest
} from "@fonoster/common";
import { makeRpcRequest } from "./client/makeRpcRequest";
import { FonosterClient } from "./client/types";
import {
  Application as ApplicationPB,
  ApplicationType,
  CreateApplicationRequest as CreateApplicationRequestPB,
  CreateApplicationResponse as CreateApplicationResponsePB,
  DeleteApplicationRequest as DeleteApplicationRequestPB,
  DeleteApplicationResponse as DeleteApplicationResponsePB,
  GetApplicationRequest as GetApplicationRequestPB,
  ListApplicationsRequest as ListApplicationsRequestPB,
  ListApplicationsResponse as ListApplicationsResponsePB,
  ProductContainer as ProductContainerPB,
  UpdateApplicationRequest as UpdateApplicationRequestPB,
  UpdateApplicationResponse as UpdateApplicationResponsePB
} from "./generated/node/applications_pb";
import { buildStructOverride } from "./utils";

/**
 * @classdesc Fonoster Applications, part of the Fonoster Voice Subsystem,
 * allow you to create, update, retrieve, and delete Voice Applications.
 * Note that an active Fonoster deployment is required.
 *
 * @example
 *
 * const SDK = require("@fonoster/sdk");
 *
 * const request = {
 *   name: "My application",
 *   type: "PROGRAMMABLE_VOICE",
 *   appEndpoint: "myapp.mydomain.com",
 *   textToSpeech: {
 *     productRef: "tts.google",
 *     config: {
 *       voice: "en-US-Casual-K"
 *     }
 *   },
 *   speechToText: {
 *     productRef: "stt.google",
 *     config: {
 *      languageCode: "en-US"
 *     }
 *   },
 *   intelligence: {
 *     productRef: "nlu.dialogflowcx",
 *     credentials: {
 *        apiKey: "your-api-key"
 *     },
 *     config: {
 *       agentId: "your-agent-id"
 *     }
 *   }
 * };
 *
 * const username = "admin@fonoster.local";
 * const password = "changeme";
 * const accessKeyId = "WO00000000000000000000000000000000";
 *
 * const client = new SDK.Client({ accessKeyId });
 *
 * client.login(username, password)
 *  .then(async () => {
 *    const apps = new SDK.Applications(client);
 *    const result = await apps.createApplication(request);
 *    console.log(result);  // successful response
 *  }).catch(console.error); // an error occurred
 */
class Applications {
  private client: FonosterClient;

  /**
   * Constructs a new Applications object.
   *
   * @param {FonosterClient} client - Client object with underlying implementations to make requests to Fonoster's API
   * @see AbstractClient
   * @see FonosterClient
   */
  constructor(client: FonosterClient) {
    this.client = client;
  }

  /**
   * Creates a new Application in Fonoster. The only required fields are the name and type of the application.
   *
   * @param {CreateApplicationRequest} request - The request object that contains the necessary information to create a new application
   * @param {string} request.name - The name of the application
   * @param {ApplicationType} request.type - The type of application (e.g., PROGRAMMABLE_VOICE)
   * @param {string} request.appEndpoint - The endpoint where the application is hosted
   * @param {TextToSpeech} request.textToSpeech - The text-to-speech configuration
   * @param {string} request.textToSpeech.productRef - The product reference of the text-to-speech engine (e.g., tts.google)
   * @param {object} request.textToSpeech.config - The configuration object for the text-to-speech engine (e.g., { voice: "en-US-Casual-K" })
   * @param {SpeechToText} request.speechToText - The speech-to-text configuration
   * @param {string} request.speechToText.productRef - The product reference of the speech-to-text engine (e.g., stt.google)
   * @param {object} request.speechToText.config - The configuration object for the speech-to-text engine (e.g., { languageCode: "en-US" })
   * @param {Intelligence} request.intelligence - The intelligence configuration
   * @param {string} request.intelligence.productRef - The product reference of the intelligence engine (e.g., nlu.dialogflowcx)
   * @param {object} request.intelligence.credentials - The credentials object for the intelligence engine (e.g., { apiKey: "your-api-key" })
   * @param {object} request.intelligence.config - The configuration object for the intelligence engine (e.g., { agentId: "your-agent-id" })
   * @return {Promise<CreateAppResponse>} - The response object that contains the reference to the newly created application
   * @example
   *
   * const request = {
   *   name: "My application",
   *   type: "PROGRAMMABLE_VOICE",
   *   appEndpoint: "myapp.mydomain.com",
   *   textToSpeech: {
   *     productRef: "tts.google",
   *     config: {
   *       voice: "en-US-Casual-K"
   *     }
   *   },
   *   speechToText: {
   *     productRef: "stt.google",
   *     config: {
   *      languageCode: "en-US"
   *     }
   *   },
   *   intelligence: {
   *     productRef: "nlu.dialogflowcx",
   *     credentials: {
   *        apiKey: "your-api-key"
   *     },
   *     config: {
   *       agentId: "your-agent-id"
   *     }
   *   }
   * };
   *
   * const apps = new SDK.Applications(client); // Existing client object
   *
   * apps.createApplication(request)
   *  .then(console.log) // successful response
   *  .catch(console.error); // an error occurred
   */
  async createApplication(
    request: CreateApplicationRequest
  ): Promise<CreateApplicationResponse> {
    const reqWithStructOverride = buildStructOverride(request);
    const applicationsClient = this.client.getApplicationsClient();

    return await makeRpcRequest<
      CreateApplicationRequestPB,
      CreateApplicationResponsePB,
      CreateApplicationRequest,
      CreateApplicationResponse
    >({
      method: applicationsClient.createApplication.bind(applicationsClient),
      requestPBObjectConstructor: CreateApplicationRequestPB,
      metadata: this.client.getMetadata(),
      request: reqWithStructOverride,
      enumMapping: [["type", ApplicationType]],
      objectMapping: [
        ["textToSpeech", ProductContainerPB],
        ["speechToText", ProductContainerPB],
        ["intelligence", ProductContainerPB]
      ]
    });
  }

  /**
   * Retrieves an existing application from Fonoster.
   *
   * @param {string} ref - The reference of the application to retrieve
   * @return {Promise<Application>} - The response object that contains the application information
   * @example
   *
   * const request = {
   *  ref: "00000000-0000-0000-0000-000000000000"
   * };
   *
   * const apps = new SDK.Applications(client); // Existing client object
   *
   * apps.getApplication(request)
   *  .then(console.log) // successful response
   *  .catch(console.error); // an error occurred
   */
  async getApplication(ref: string): Promise<Application> {
    const applicationsClient = this.client.getApplicationsClient();
    return await makeRpcRequest<
      GetApplicationRequestPB,
      ApplicationPB,
      GetApplicationRequest,
      Application
    >({
      method: applicationsClient.getApplication.bind(applicationsClient),
      requestPBObjectConstructor: GetApplicationRequestPB,
      metadata: this.client.getMetadata(),
      request: { ref }
    });
  }

  /**
   * Updates an existing application in Fonoster.
   *
   * @param {UpdateApplicationRequest} request - The request object that contains the necessary information to update an application
   * @param {string} request.ref - The reference of the application to update
   * @param {string} request.name - The name of the application
   * @param {string} request.appEndpoint - The endpoint where the application is hosted
   * @param {TextToSpeech} request.textToSpeech - The text-to-speech configuration
   * @param {string} request.textToSpeech.productRef - The product reference of the text-to-speech engine (e.g., tts.google)
   * @param {object} request.textToSpeech.config - The configuration object for the text-to-speech engine (e.g., { voice: "en-US-Casual-K" })
   * @param {SpeechToText} request.speechToText - The speech-to-text configuration
   * @param {string} request.speechToText.productRef - The product reference of the speech-to-text engine (e.g., stt.google)
   * @param {object} request.speechToText.config - The configuration object for the speech-to-text engine (e.g., { languageCode: "en-US" })
   * @param {Intelligence} request.intelligence - The intelligence configuration
   * @param {string} request.intelligence.productRef - The product reference of the intelligence engine (e.g., nlu.dialogflowcx)
   * @param {object} request.intelligence.credentials - The credentials object for the intelligence engine (e.g., { apiKey: "your-api-key" })
   * @param {object} request.intelligence.config - The configuration object for the intelligence engine (e.g., { agentId: "your-agent-id" })
   * @return {Promise<BaseApiObject>} - The response object that contains the reference to the updated application
   * @example
   *
   * const request = {
   *  ref: "00000000-0000-0000-0000-000000000000",
   *  name: "My application",
   *  appEndpoint: "myapp.mydomain.com"
   * }
   *
   * const apps = new SDK.Applications(client); // Existing client object
   *
   * apps.updateApplication(request)
   *  .then(console.log) // successful response
   *  .catch(console.error); // an error occurred
   */
  async updateApplication(
    request: UpdateApplicationRequest
  ): Promise<BaseApiObject> {
    const reqWithStructOverride = buildStructOverride(request);

    const applicationsClient = this.client.getApplicationsClient();
    return await makeRpcRequest<
      UpdateApplicationRequestPB,
      UpdateApplicationResponsePB,
      UpdateApplicationRequest,
      BaseApiObject
    >({
      method: applicationsClient.updateApplication.bind(applicationsClient),
      requestPBObjectConstructor: UpdateApplicationRequestPB,
      metadata: this.client.getMetadata(),
      request: reqWithStructOverride,
      enumMapping: [["type", ApplicationType]],
      objectMapping: [
        ["textToSpeech", ProductContainerPB],
        ["speechToText", ProductContainerPB],
        ["intelligence", ProductContainerPB]
      ]
    });
  }

  /**
   * Retrieves a list of applications from Fonoster.
   *
   * @param {ListApplicationsRequest} request - The request object that contains the necessary information to retrieve a list of applications
   * @param {number} request.pageSize - The number of applications to retrieve
   * @param {string} request.pageToken - The token to retrieve the next page of applications
   * @return {Promise<ListApplicationsResponse>} - The response object that contains the list of applications
   * @example
   *
   * const request = {
   *  pageSize: 10,
   *  pageToken: "00000000-0000-0000-0000-000000000000"
   * };
   *
   * const apps = new SDK.Applications(client); // Existing client object
   *
   * apps.listApplications(request)
   *  .then(console.log) // successful response
   *  .catch(console.error); // an error occurred
   */
  async listApplications(
    request: ListApplicationsRequest
  ): Promise<ListApplicationsResponse> {
    const applicationsClient = this.client.getApplicationsClient();
    return await makeRpcRequest<
      ListApplicationsRequestPB,
      ListApplicationsResponsePB,
      ListApplicationsRequest,
      ListApplicationsResponse
    >({
      method: applicationsClient.listApplications.bind(applicationsClient),
      requestPBObjectConstructor: ListApplicationsRequestPB,
      metadata: this.client.getMetadata(),
      request,
      repeatableObjectMapping: [["itemsList", ApplicationPB]]
    });
  }

  /**
   * Deletes an existing application from Fonoster.
   * Note that this operation is irreversible.
   *
   * @param {string} ref - The reference of the application to delete
   * @return {Promise<BaseApiObject>} - The response object that contains the reference to the deleted application
   * @example
   *
   * const ref =  "00000000-0000-0000-0000-000000000000"
   *
   * const apps = new SDK.Applications(client); // Existing client object
   *
   * apps.deleteApplication(ref)
   *  .then(console.log) // successful response
   *  .catch(console.error); // an error occurred
   */
  async deleteApplication(ref: string): Promise<BaseApiObject> {
    const applicationsClient = this.client.getApplicationsClient();
    return await makeRpcRequest<
      DeleteApplicationRequestPB,
      DeleteApplicationResponsePB,
      BaseApiObject,
      BaseApiObject
    >({
      method: applicationsClient.deleteApplication.bind(applicationsClient),
      requestPBObjectConstructor: DeleteApplicationRequestPB,
      metadata: this.client.getMetadata(),
      request: { ref }
    });
  }
}

export { Applications };