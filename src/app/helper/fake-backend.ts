import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User, Role, Content,Detail } from '../model';

const users: User[] = [
    { id: 1, username: 'admin', password: 'admin', firstName: 'Yudi', lastName: 'Gunawan', role: Role.Instructor },
    { id: 2, username: 'user', password: 'user', firstName: 'Ladies', lastName: '/ Gentleman', role: Role.User },
    { id: 3, username: 'yudi', password: 'gunawan', firstName: 'Yudi', lastName: 'Gunawan', role: Role.Instructor },
];

const contents:Content[]=[
    { id: 1, idadmin: 1, title: 'Beginner1', description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero sequi quod ut cum ea magni neque, similique, facere, quibusdam consequuntur deleniti numquam. In ab quia, commodi dolores excepturi quibusdam magni!',level:1},
    { id: 2, idadmin: 3, title: 'Beginner2', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero sequi quod ut cum ea magni neque, similique, facere, quibusdam consequuntur deleniti numquam. In ab quia, commodi dolores excepturi quibusdam magni!', level: 1 },
    { id: 3, idadmin: 1, title: 'Intermediet1', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero sequi quod ut cum ea magni neque, similique, facere, quibusdam consequuntur deleniti numquam. In ab quia, commodi dolores excepturi quibusdam magni!', level: 2 },
    { id: 4, idadmin: 3, title: 'Advance1', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero sequi quod ut cum ea magni neque, similique, facere, quibusdam consequuntur deleniti numquam. In ab quia, commodi dolores excepturi quibusdam magni!', level: 3 },
]

const detailContent:Detail[] =[
    { id: 1, idcontent: 1, title: 'Beginner1.1', description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero sequi quod ut cum ea magni neque, similique, facere, quibusdam consequuntur deleniti numquam. In ab quia, commodi dolores excepturi quibusdam magni!',timer:60},
    { id: 2, idcontent: 1, title: 'Beginner1.2', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero sequi quod ut cum ea magni neque, similique, facere, quibusdam consequuntur deleniti numquam. In ab quia, commodi dolores excepturi quibusdam magni!', timer: 60 },
    { id: 3, idcontent: 2, title: 'Beginner2.1', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero sequi quod ut cum ea magni neque, similique, facere, quibusdam consequuntur deleniti numquam. In ab quia, commodi dolores excepturi quibusdam magni!', timer: 60 },
    { id: 4, idcontent: 3, title: 'Intermediet1.1', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero sequi quod ut cum ea magni neque, similique, facere, quibusdam consequuntur deleniti numquam. In ab quia, commodi dolores excepturi quibusdam magni!', timer: 60 },
    { id: 5, idcontent: 4, title: 'Advance1.1', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero sequi quod ut cum ea magni neque, similique, facere, quibusdam consequuntur deleniti numquam. In ab quia, commodi dolores excepturi quibusdam magni!', timer: 60 }
]

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.endsWith('/content') && method === 'GET':
                    return getContents();
                case url.match(/\/content\/\d+$/) && method === 'GET':
                    return getContentsById();
                case url.match(/\/detail-content\/\d+$/) && method === 'GET':
                    return getDetailContent();
                case url.match(/\/detail\/\d+$/) && method === 'GET':
                    return getDetailById();
                case url.endsWith('/content-beginner') && method === 'GET':
                    return getBeginnerContent();
                case url.endsWith('/content-intermediet') && method === 'GET':
                    return getIntermedietContent();
                case url.endsWith('/content-advance') && method === 'GET':
                    return getAdvanceContent();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }

        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: `fake-jwt-token.${user.id}`
            });
        }

        function getUsers() {
            if (!isAdmin()) return unauthorized();
            return ok(users);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            // only admins can access other user records
            if (!isAdmin() && currentUser().id !== idFromUrl()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(user);
        }

        function getDetailContent(){
            if (!isLoggedIn()) return unauthorized();
            const details = detailContent.filter(a => a.id === idFromUrl())
            return ok(details);
            
        }

        function getContents() {
            if (!isLoggedIn()) return unauthorized();
            return ok(contents);
        }

        function getContentsById() {
            if (!isAdmin() && currentUser().id !== idFromUrl()) return unauthorized();
            const content = contents.filter(x => x.idadmin === idFromUrl());
            return ok(content);
        }

        function getBeginnerContent() {
            if (!isLoggedIn()) return unauthorized();
            const content = contents.filter(x=>x.level === 1);
            return ok(content);
        }

        function getDetail() {
            if (!isLoggedIn()) return unauthorized();
            return ok(detailContent);
        }

        function getDetailById() {
            if (!isLoggedIn()) return unauthorized();
            const detail = detailContent.filter(x => x.idcontent === idFromUrl());
            return ok(detail);
        }

        function getIntermedietContent() {
            if (!isLoggedIn()) return unauthorized();
            const content = contents.filter(x => x.level === 2);
            return ok(content);
        }

        function getAdvanceContent() {
            if (!isLoggedIn()) return unauthorized();
            const content = contents.filter(x => x.level === 3);
            return ok(content);
        }

        // helper functions

        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'unauthorized' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }

        function isLoggedIn() {
            const authHeader = headers.get('Authorization') || '';
            return authHeader.startsWith('Bearer fake-jwt-token');
        }

        function isAdmin() {
            return isLoggedIn() && currentUser().role === Role.Instructor;
        }

        function currentUser() {
            if (!isLoggedIn()) return;
            const id = parseInt(headers.get('Authorization').split('.')[1]);
            return users.find(x => x.id === id);
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};