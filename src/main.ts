import { Network, Computer, CPU, Memory, Disk } from "./module";

const network = new Network("MISIS network");

network.addComputer(
  new Computer("server1.misis.ru")
    .addAddress("192.168.1.1")
    .addComponent(new CPU(4, 2500))
    .addComponent(new Memory(16000))
);

network.addComputer(
  new Computer("server2.misis.ru")
    .addAddress("10.0.0.1")
    .addComponent(new CPU(8, 3200))
    .addComponent(
      new Disk(Disk.MAGNETIC, 2000)
        .addPartition(500, "system")
        .addPartition(1500, "data")
    )
);

const app = document.getElementById("app");
if (app) {
  app.innerText = network.toString();
}
