import { Network, Computer, CPU, Memory, Disk } from "../src/module";

test("Корректность отображения иерархии", () => {
  const network = new Network("MISIS network");

  const server1 = new Computer("server1.misis.ru")
    .addAddress("192.168.1.1")
    .addComponent(new CPU(4, 2500))
    .addComponent(new Memory(16000));
  const server2 = new Computer("server2.misis.ru")
    .addAddress("10.0.0.1")
    .addComponent(new CPU(8, 3200))
    .addComponent(
      new Disk(Disk.SSD, 2000)
        .addPartition(500, "system")
        .addPartition(1500, "data")
    );

  network.addComputer(server1);
  network.addComputer(server2);

  const expectedOutput = `Network: MISIS network
  +-Host: server1.misis.ru
  | +-192.168.1.1
  | +-CPU, 4 cores @ 2500MHz
  | \\-Memory, 16000 MiB
  \\-Host: server2.misis.ru
    +-10.0.0.1
    +-CPU, 8 cores @ 3200MHz
    \\-SSD, 2000 GiB
      +-[0]: 500 GiB, system
      \\-[1]: 1500 GiB, data`;

  const formatString = (str: string) =>
    str
      .replace(/\r?\n|\r/g, "\n")
      .replace(/\s+/g, " ")
      .trim();

  const formattedOutput = formatString(network.toString());
  const formattedExpectedOutput = formatString(expectedOutput);

  expect(formattedOutput).toEqual(formattedExpectedOutput);
});

test("Поиск компьютера по имени", () => {
  const network = new Network("TestNet");
  const server1 = new Computer("server1").addAddress("192.168.1.1");
  const server2 = new Computer("server2").addAddress("10.0.0.1");

  network.addComputer(server1).addComputer(server2);

  const foundServer = network.findComputer("server2");
  expect(foundServer).toBeDefined();
  expect(foundServer?.name).toBe("server2");
});

test("Клонирование сети", () => {
  const originalNetwork = new Network("OriginalNet");
  const server = new Computer("server").addComponent(new Memory(4096));
  originalNetwork.addComputer(server);

  const clonedNetwork = originalNetwork.clone();

  const clonedServer = clonedNetwork.findComputer("server")!;
  clonedServer.addComponent(new CPU(4, 2500));

  expect(originalNetwork.findComputer("server")?.components.length).toBe(1);
  expect(clonedServer.components.length).toBe(2);
});

test("Корректность работы с дисками и разделами", () => {
  const network = new Network("TestNet");

  network.addComputer(
    new Computer("server1")
      .addAddress("192.168.1.1")
      .addComponent(
        new Disk(1, 1000).addPartition(500, "system").addPartition(500, "data")
      )
  );

  const server1 = network.findComputer("server1");
  expect(server1).toBeDefined();
  expect(server1?.components[0] instanceof Disk).toBe(true);
  expect((server1?.components[0] as Disk).partitions.length).toBe(2);
});

test("Независимость клонирования", () => {
  const originalNetwork = new Network("OriginalNet");
  const server = new Computer("server").addComponent(new Memory(8192));
  originalNetwork.addComputer(server);

  const clonedNetwork = originalNetwork.clone();
  const clonedServer = clonedNetwork.findComputer("server")!;

  clonedServer.addComponent(new CPU(8, 3600));

  expect(originalNetwork.findComputer("server")?.components.length).toBe(1);
  expect(clonedServer.components.length).toBe(2);
});
