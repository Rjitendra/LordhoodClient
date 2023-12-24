import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

export abstract class ServiceBase {

    constructor(protected http: HttpClient) {
    }
    protected toApiUrl(uri: any): any {
        return `${environment.apiBaseUrl}${uri}`;
    }
}