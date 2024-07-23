# Tools

## Data exports

### Prerequisites

You need to have installed:

- mongosh
- mongo (for mongoexport)

### How to export

At the root of the project run:

```sh
chmod +x ./tools/mongo_extract.sh && ./tools/mongo_extract.sh
```

The generated CSV files will be located in the the ./data folder
