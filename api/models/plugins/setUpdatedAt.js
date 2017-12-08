import Bluebird from 'bluebird';

export default (Model) => {
  return class extends Model {
    $beforeUpdate(opt, context) {
      const maybePromise = super.$beforeUpdate(opt, context);

      return Bluebird
        .resolve(maybePromise)
        .then(() => {
          this.updated_at = new Date().toISOString();
        });
    }
  };
};
