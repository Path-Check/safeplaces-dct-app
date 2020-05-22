import axios from 'axios';

const api = 'http://localhost/3000/';
const request = axios.create({
  baseURL: api,
});

class service {
  constructor() {
    this.path = api;
  }
  post(path = '', object) {
    return new Promise((resolve, reject) => {
      request
        .post(path, object)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  put(path = '', object) {
    return new Promise((resolve, reject) => {
      request
        .put(`${this.path}${path}`, object)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err.response.data);
        });
    });
  }
  patch(path = '', object) {
    return new Promise((resolve, reject) => {
      request
        .patch(`${this.path}${path}/${object.id}`, object)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err.response.data);
        });
    });
  }
  get(path = '', filter = {}) {
    return new Promise((resolve, reject) => {
      request
        .get(path, { params: filter })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  delete(path = '', id) {
    return new Promise((resolve, reject) => {
      request.delete(`${path}/${id}`).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        },
      );
    });
  }
}
export const Service = new service();
