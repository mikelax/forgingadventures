import Bluebird from 'bluebird';

export default function (Service, options) {
  return Bluebird.try(() => {
    const service = new Service(options);
    return service.execute();
  });
}
