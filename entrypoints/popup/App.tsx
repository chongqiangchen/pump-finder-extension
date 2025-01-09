import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

function App() {
  return (
    <div className="w-[400px]">
      <Card className={"rounded-none"}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Pump Finder</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div>
            有问题可以联系 <a href="https://x.com/_daxiongya" target="_blank" className="text-blue-500 hover:underline">@_daxiongya</a>
          </div>
          <div>
            ☕️ Solana 捐赠地址：FYyUWw1cZqM5VZjQ3LtQKc4Wym7vYWb7ChPCqEPv6e3R
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
