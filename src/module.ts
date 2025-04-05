export abstract class Printable {
  abstract clone(): Printable;
  abstract print_me(prefix?: string, isLast?: boolean): string;
}

export class Address extends Printable {
  constructor(public address: string) {
    super();
  }

  clone(): Address {
    return new Address(this.address);
  }

  print_me(prefix = "", isLast = false): string {
    return `${prefix}${isLast ? "\\-" : "+-"}${this.address}\n`;
  }
}

export abstract class Component extends Printable {
  constructor(public numericVal: number) {
    super();
  }
}

export class CPU extends Component {
  constructor(public cores: number, public mhz: number) {
    super(mhz);
  }

  clone(): CPU {
    return new CPU(this.cores, this.mhz);
  }

  print_me(prefix = "", isLast = false): string {
    return `${prefix}${isLast ? "\\-" : "+-"}CPU, ${this.cores} cores @ ${
      this.mhz
    }MHz\n`;
  }
}

export class Memory extends Component {
  constructor(public size: number) {
    super(size);
  }

  clone(): Memory {
    return new Memory(this.size);
  }

  print_me(prefix = "", isLast = false): string {
    return `${prefix}${isLast ? "\\-" : "+-"}Memory, ${this.size} MiB\n`;
  }
}

export class Partition {
  constructor(public size: number, public name: string) {}

  clone(): Partition {
    return new Partition(this.size, this.name);
  }

  print_me(index: number, prefix = "", isLast = false): string {
    return `${prefix}${isLast ? "\\-" : "+-"}[${index}]: ${this.size} GiB, ${
      this.name
    }\n`;
  }
}

export class Disk extends Component {
  static readonly SSD = 0;
  static readonly MAGNETIC = 1;

  partitions: Partition[] = [];

  constructor(public storageType: number, size: number) {
    super(size);
  }

  addPartition(size: number, name: string): this {
    this.partitions.push(new Partition(size, name));
    return this;
  }

  clone(): Disk {
    const copy = new Disk(this.storageType, this.numericVal);
    this.partitions.forEach((p) => copy.partitions.push(p.clone()));
    return copy;
  }

  print_me(prefix = "", isLast = false): string {
    const lines = [];
    const label = this.storageType === Disk.SSD ? "SSD" : "HDD";
    lines.push(
      `${prefix}${isLast ? "\\-" : "+-"}${label}, ${this.numericVal} GiB\n`
    );
    const newPrefix = prefix + (isLast ? "  " : "| ");
    this.partitions.forEach((p, i) => {
      const last = i === this.partitions.length - 1;
      lines.push(p.print_me(i, newPrefix, last));
    });
    return lines.join("");
  }
}

export class Computer extends Printable {
  addresses: Address[] = [];
  components: Component[] = [];

  constructor(public name: string) {
    super();
  }

  addAddress(addr: string): this {
    this.addresses.push(new Address(addr));
    return this;
  }

  addComponent(comp: Component): this {
    this.components.push(comp);
    return this;
  }

  clone(): Computer {
    const copy = new Computer(this.name);
    this.addresses.forEach((a) => copy.addresses.push(a.clone()));
    this.components.forEach((c) =>
      copy.components.push(c.clone() as Component)
    );
    return copy;
  }

  print_me(prefix = "", isLast = false): string {
    const lines = [`${prefix}${isLast ? "\\-" : "+-"}Host: ${this.name}\n`];
    const newPrefix = prefix + (isLast ? "  " : "| ");
    const total = this.addresses.length + this.components.length;
    const all = [...this.addresses, ...this.components];

    all.forEach((item, i) => {
      const isLastItem = i === total - 1;
      lines.push(item.print_me(newPrefix, isLastItem));
    });

    return lines.join("");
  }
}

export class Network extends Printable {
  computers: Computer[] = [];

  constructor(public name: string) {
    super();
  }

  addComputer(comp: Computer): this {
    this.computers.push(comp);
    return this;
  }

  findComputer(name: string): Computer | undefined {
    return this.computers.find((c) => c.name === name);
  }

  clone(): Network {
    const copy = new Network(this.name);
    this.computers.forEach((c) => copy.addComputer(c.clone()));
    return copy;
  }

  print_me(prefix = "", isLast = false): string {
    const lines = [`Network: ${this.name}\n`];
    this.computers.forEach((c, i) => {
      const last = i === this.computers.length - 1;
      lines.push(c.print_me("", last));
    });
    return lines.join("");
  }

  toString(): string {
    return this.print_me();
  }
}
