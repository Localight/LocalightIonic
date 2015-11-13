'use strict';

describe('Service: loadingSpinner', function () {

  // load the service's module
  beforeEach(module('angularLocalightApp'));

  // instantiate service
  var loadingSpinner;
  beforeEach(inject(function (_loadingSpinner_) {
    loadingSpinner = _loadingSpinner_;
  }));

  it('should do something', function () {
    expect(!!loadingSpinner).toBe(true);
  });

});
