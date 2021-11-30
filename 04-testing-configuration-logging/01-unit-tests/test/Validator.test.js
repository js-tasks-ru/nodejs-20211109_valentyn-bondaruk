const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет тип', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const value = {name: 6};

      const errors = validator.validate(value);

      expect(errors).to.have.length(1);

      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal(
          `expect ${validator.rules.name.type}, got ${typeof value.name}`,
      );
    });

    it('валидатор проверяет строковые поля на минимальную длину', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const value = {name: 'Lalala'};

      const errors = validator.validate(value);

      expect(errors).to.have.length(1);

      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal(
          `too short, expect ${validator.rules.name.min}, got ${value.name.length}`,
      );
    });

    it('валидатор проверяет строковые поля на максимальную длину', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const value = {name: 'LalalaLalalaLalalaLalala'};

      const errors = validator.validate(value);

      expect(errors).to.have.length(1);

      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal(
          `too long, expect ${validator.rules.name.max}, got ${value.name.length}`,
      );
    });

    it('валидатор проверяет минимальное число', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 10,
        },
      });

      const value = {age: 3};

      const errors = validator.validate(value);

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal(
          `too little, expect ${validator.rules.age.min}, got ${value.age}`,
      );
    });

    it('валидатор проверяет максимальное число', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 10,
        },
      });

      const value = {age: 50};

      const errors = validator.validate(value);

      expect(errors).to.have.length(1);

      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal(
          `too big, expect ${validator.rules.age.max}, got ${value.age}`,
      );
    });
  });
});
