/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import {sum} from "./lib";
import {assert} from "chai";

describe("module1 default function", () => {
    it("returns module1", () => {
        assert.equal(sum(1,2), 3);
    });
});
