export function convertGroupIdsToNames(groupIds, allGroups, removeUngrouped) {
    var groupNames = []
    if (allGroups && allGroups.length > 0) {
        if (groupIds && groupIds.length > 0) {
           // remove the "UNGROUPED" group, if it exists
           if (removeUngrouped) {
               groupIds = groupIds.filter(function(groupId) {
                    return ungroupedId != groupId;
                })
            }

            // identify the user's CourseGroups so we can find the group names
            let userGroups = allGroups.filter((g) => {
                return groupIds.indexOf(g.id) != -1
            });

            groupNames = userGroups.map(group => group.name)
            groupNames.sort(caseInsensitiveSort);
        }
    }

    return groupNames;
}

export var caseInsensitiveSort = function(a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }

