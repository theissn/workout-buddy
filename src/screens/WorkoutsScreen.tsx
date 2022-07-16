import { format } from "date-fns";
import { View, Text, FlatList, TouchableHighlight } from "react-native";

interface Workout {
  id: number;
  title: string;
  date: string;
}

const data: Workout[] = [
  { id: 1, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 2, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 3, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 4, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 5, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 6, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 7, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 8, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 9, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 10, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 11, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 12, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 13, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 14, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 15, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 16, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 17, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 18, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 19, title: "Back", date: format(new Date(), "E do, MMM") },
  { id: 20, title: "Back", date: format(new Date(), "E do, MMM") },
];

function ListItem({ id, title, date }) {
  return (
    <TouchableHighlight onPress={() => console.log(id)}>
      <View
        style={{
          padding: 20,
          borderColor: "#000",
          borderBottomWidth: 0.25,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fefefe",
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <Text>
            {date} - {title}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
          }}
        >
          <Text>➡️</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const renderItem = ({ item }: any) => <ListItem {...item} />;

export default function WorkoutsScreen() {
  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
