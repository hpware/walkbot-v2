  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] ${file} is missing a required "data" or "execute" property.`,
    );
  }
