
def format(arg):
    arg["id"] = str(arg["_id"])
    del arg["_id"]
    return arg