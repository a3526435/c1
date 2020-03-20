const { accounts, contract, web3 } = require("@openzeppelin/test-environment");
const {
  BN,
  constants,
  ether,
  balance,
  expectRevert
} = require("@openzeppelin/test-helpers");
const { ZERO_ADDRESS } = constants;
const { expect } = require("chai");

const ETHSlotMachine = contract.fromArtifact("ETHSlotMachine");

describe("ETHSlotMachine", function() {
  const [alice, bob, owner] = accounts;
  const name = "NonFungibleToken";
  const symbol = "NFT";
  const firstTokenId = new BN(100);
  const secondTokenId = new BN(200);

  beforeEach(async function() {
    this.slot = await ETHSlotMachine.new({ from: alice });
    await this.slot.initialize({
      from: alice,
      value: ether("0.01")
    });
  });

  it("can set initial price", async function() {
    expect(await this.slot.price()).be.bignumber.equal(ether("0.01"));
  });
  it("msg.value gets added to pot", async function() {
    expect(await this.slot.pot()).to.be.bignumber.equal(ether("0.01"));
  });
  it("contract holds money", async function() {
    expect(await balance.current(this.slot.address)).to.be.bignumber.equal(
      ether("0.01")
    );
  });
  it("only owner can update price", async function() {
    await this.slot.setPrice(ether("0.02"), { from: alice });
    expect(await this.slot.getPrice()).to.be.bignumber.equal(ether("0.02"));
  });
  it("player can lose money and owner can receive fees", async function() {
    const amount = await this.slot.pot();
    await this.slot.setRanNum(21, { from: alice });
    const ownerBalance = await balance.current(alice);
    await this.slot.getLucky({ from: bob, value: ether("0.01") });
    expect(await this.slot.pot()).to.be.bignumber.equal(`${amount * 1.98}`);
    expect(await balance.current(this.slot.address)).to.be.bignumber.equal(
      `${amount * 1.98}`
    );
    const fee = (await balance.current(alice)).sub(ownerBalance);
    expect(fee).to.be.bignumber.equal(`${amount * 0.02}`);
  });

  it("player can win first price", async function() {
    await this.slot.setRanNum(7, { from: alice });
    await this.slot.getLucky({ from: bob, value: ether("0.01") });
    expect(await this.slot.pot()).to.be.bignumber.equal("0");
    expect(await balance.current(this.slot.address)).to.be.bignumber.equal("0");
  });
  it("player can win second price", async function() {
    const amount = await this.slot.pot();
    await this.slot.setRanNum(20, { from: alice });
    await this.slot.getLucky({ from: bob, value: ether("0.01") });
    expect(await this.slot.pot()).to.be.bignumber.equal(`${amount * 0.8}`);
    expect(await balance.current(this.slot.address)).to.be.bignumber.equal(
      `${amount * 0.8}`
    );
  });
  it("player can win third price", async function() {
    const amount = await this.slot.pot();
    await this.slot.setRanNum(10, { from: alice });
    await this.slot.getLucky({ from: bob, value: ether("0.01") });
    expect(await this.slot.pot()).to.be.bignumber.equal(`${amount * 0.9}`);
    expect(await balance.current(this.slot.address)).to.be.bignumber.equal(
      `${amount * 0.9}`
    );
  });
  it("player can win forth price", async function() {
    const amount = await this.slot.pot();
    await this.slot.setRanNum(4, { from: alice });
    await this.slot.getLucky({ from: bob, value: ether("0.01") });
    expect(await this.slot.pot()).to.be.bignumber.equal(`${amount * 0.96}`);
    expect(await balance.current(this.slot.address)).to.be.bignumber.equal(
      `${amount * 0.96}`
    );
  });
  it("player can win fifth price", async function() {
    const amount = await this.slot.pot();
    await this.slot.setRanNum(2, { from: alice });
    await this.slot.getLucky({ from: bob, value: ether("0.01") });
    expect(await this.slot.pot()).to.be.bignumber.equal(`${amount * 0.98}`);
    expect(await balance.current(this.slot.address)).to.be.bignumber.equal(
      `${amount * 0.98}`
    );
  });
});
