window.CaseController = (() => {
  return {
    init: () => {
      function getCookie(cname) {
        const name = `${cname}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i += 1) {
          let c = ca[i];
          c = c.trim();
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return '';
      }

      const token = window.sessionStorage.getItem('userInfo-token');
      const iD = getCookie('id');
      const weaponArray = ['handgun', 'rifle', 'blunt force', 'bodily force', 'knife', 'unknown'];
      const motiveArray = ['robbery', 'burglary', 'gang', 'narcotics', 'domestic violence', 'dispute', 'accidental', 'self defense', 'unknown'];

      $.ajax({
        type: 'GET',
        url: `http://localhost:3000/cases?_id=${iD}`,
        headers: {
          'x-access-token': token
        }
      }).done((data) => {
        const caseData = data[0];
        console.log(caseData);

        function indexOfData(index, dataInIndex) {
          return caseData[index].indexOf(dataInIndex);
        }

        $.getScript('js/caseFieldFunctionality.js', () => {
          caseUI.fields['drNum']['input'].val(caseData.drNumber);
          caseUI.fields['masterDrNum']['input'].val(caseData.masterDrNumber);
          caseUI.fields['division']['input'].val(caseData.division);
          caseUI.fields['bureau']['input'].val(caseData.bureau);
          caseUI.fields['notes']['input'].val(caseData.notes);

          // TODO: what is this?
          moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');

          caseUI.fields['dateOccured']['input'].val(moment(caseData.dateOccured).tz('America/Los_Angeles').format('YYYY-MM-DD'));
          caseUI.fields['dateReported']['input'].val(moment(caseData.dateReported).tz('America/Los_Angeles').format('YYYY-MM-DD'));
          caseUI.fields['reportingDistrict']['input'].val(caseData.reportingDistrict);
          caseUI.fields['caseStatus']['input'].val(caseData.caseStatus);
          caseUI.fields['caseStatusDate']['input'].val(moment(caseData.caseStatusDate).tz('America/Los_Angeles').format('YYYY-MM-DD'));
          caseUI.fields['solvabilityFactor']['input'].val(caseData.solvabilityFactor);

          for (let i = 0; i < weaponArray.length; i += 1) {
            caseUI.fields['weapon']['inputs'][i].prop('checked', indexOfData('weaponUsed', weaponArray[i]) > -1);
          }

          for (let i = 0; i < motiveArray.length; i += 1) {
            caseUI.fields['motive']['inputs'][i].prop('checked', indexOfData('motive', motiveArray[i]) > -1);
          }

          caseUI.fields['streetNumber']['input'].val(caseData.address.streetNumber);
          caseUI.fields['streetName']['input'].val(caseData.address.streetName);
          caseUI.fields['city']['input'].val(caseData.address.city);
          caseUI.fields['zipCode']['input'].val(caseData.address.zipCode);

          // TODO: Remove if when done
          if (caseData.victim) {
            caseUI.fields['victFirstName']['input'].val(caseData.victim.victName.first);
            caseUI.fields['victMiddleName']['input'].val(caseData.victim.victName.middle);
            caseUI.fields['victLastName']['input'].val(caseData.victim.victName.last);
            caseUI.fields['victSex']['input'].val(caseData.victim.victSex);
            caseUI.fields['victDesc']['input'].val(caseData.victim.victDesc);
            caseUI.fields['victAge']['input'].val(caseData.victim.victAge);
            caseUI.fields['victId']['input'].val(caseData.victim['_id']);
          }

          // if there is more than one suspect
          caseUI.fields['suspFirstName']['input'].val(caseData.suspects[0].suspName.first);
          caseUI.fields['suspMiddleName']['input'].val(caseData.suspects[0].suspName.middle);
          caseUI.fields['suspLastName']['input'].val(caseData.suspects[0].suspName.last);
          caseUI.fields['suspSex']['input'].val(caseData.suspects[0].suspSex);
          caseUI.fields['suspSupervisedReleaseStatus']['input'].val(caseData.suspects[0].supervisedReleaseStatus);
          caseUI.fields['suspDesc']['input'].val(caseData.suspects[0].suspDesc);
          caseUI.fields['suspAge']['input'].val(caseData.suspects[0].suspAge);
          // not fully working
          // caseUI.fields['juvenileTriedAsAdult']['input'].val(caseData.suspects[0].juvenileTriedAsAdult);
          caseUI.fields['juvenileTriedAsAdult']['input'].prop('selectedIndex', caseData.suspects[0]['juvenileTriedAsAdult'] ? 1 : 2);
          caseUI.fields['suspId']['input'].val(caseData.suspects[0]['_id']);

          $('#drNumInput').prop('readonly', true);
          $('#masterDrNumInput').prop('readonly', true);
          $('#divisionInput').prop('disabled', true);
          $('#bureauInput').prop('disabled', true);
          $('#notesInput').prop('readonly', true);
          $('#dateOccuredInput').prop('readonly', true);
          $('#dateReportedInput').prop('readonly', true);
          $('#reportingDistrictInput').prop('disabled', true);
          $('#caseStatusInput').prop('disabled', true);
          $('#caseStatusDateInput').prop('readonly', true);
          $('#solvabilityFactorInput').prop('disabled', true);

          // weaponsList
          $('#weaponInput_handgun').prop('disabled', true);
          $('#weaponInput_rifle').prop('disabled', true);
          $('#weaponInput_bluntForce').prop('disabled', true);
          $('#weaponInput_bodilyForce').prop('disabled', true);
          $('#weaponInput_knife').prop('disabled', true);
          $('#weaponInput_unknown').prop('disabled', true);

          // motivesList
          $('#motiveInput_robbery').prop('disabled', true);
          $('#motiveInput_burglary').prop('disabled', true);
          $('#motiveInput_gang').prop('disabled', true);
          $('#motiveInput_narcotics').prop('disabled', true);
          $('#motiveInput_domesticViolence').prop('disabled', true);
          $('#motiveInput_dispute').prop('disabled', true);
          $('#motiveInput_accidental').prop('disabled', true);
          $('#motiveInput_selfDefense').prop('disabled', true);
          $('#motiveInput_unknown').prop('disabled', true);

          // address
          $('#streetNumberInput').prop('readonly', true);
          $('#streetNameInput').prop('readonly', true);
          $('#cityInput').prop('readonly', true);
          $('#zipCodeInput').prop('readonly', true);

          // victimInformation
          $('#victFirstNameInput').prop('readonly', true);
          $('#victMiddleNameInput').prop('readonly', true);
          $('#victLastNameInput').prop('readonly', true);
          $('#victSexInput').prop('disabled', true);
          $('#victDescInput').prop('readonly', true);
          $('#victAgeInput').prop('readonly', true);
          $('#victIdInput').prop('disabled', true);

          // suspectInformation
          $('#suspFirstNameInput').prop('readonly', true);
          $('#suspMiddleNameInput').prop('readonly', true);
          $('#suspLastNameInput').prop('readonly', true);
          $('#suspSexInput').prop('disabled', true);
          $('#suspSupervisedReleaseStatusInput').prop('disabled', true);
          $('#suspDescInput').prop('readonly', true);
          $('#suspAgeInput').prop('readonly', true);
          $('#juvenileTriedAsAdultInput').prop('disabled', true);
          $('#suspIdInput').prop('disabled', true);

          const save = $('#button-save-page');
          $(save).prop('disabled', true);

          $('#edit').click(() => {
            $('#drNumInput').removeAttr('readonly');
            $('#masterDrNumInput').removeAttr('readonly');
            $('#divisionInput').removeAttr('disabled');
            $('#bureauInput').removeAttr('disabled');
            $('#notesInput').removeAttr('readonly');
            $('#dateOccuredInput').removeAttr('readonly');
            $('#dateReportedInput').removeAttr('readonly');
            $('#reportingDistrictInput').removeAttr('disabled');
            $('#caseStatusInput').removeAttr('disabled');
            $('#caseStatusDateInput').removeAttr('readonly');
            $('#solvabilityFactorInput').removeAttr('disabled');

            $('#weaponInput_handgun').removeAttr('disabled');
            $('#weaponInput_rifle').removeAttr('disabled');
            $('#weaponInput_bluntForce').removeAttr('disabled');
            $('#weaponInput_bodilyForce').removeAttr('disabled');
            $('#weaponInput_knife').removeAttr('disabled');
            $('#weaponInput_unknown').removeAttr('disabled');

            $('#motiveInput_robbery').removeAttr('disabled');
            $('#motiveInput_burglary').removeAttr('disabled');
            $('#motiveInput_gang').removeAttr('disabled');
            $('#motiveInput_narcotics').removeAttr('disabled');
            $('#motiveInput_domesticViolence').removeAttr('disabled');
            $('#motiveInput_dispute').removeAttr('disabled');
            $('#motiveInput_accidental').removeAttr('disabled');
            $('#motiveInput_selfDefense').removeAttr('disabled');
            $('#motiveInput_unknown').removeAttr('disabled');

            $('#streetNumberInput').removeAttr('readonly');
            $('#streetNameInput').removeAttr('readonly');
            $('#cityInput').removeAttr('readonly');
            $('#zipCodeInput').removeAttr('readonly');

            $('#victFirstNameInput').removeAttr('readonly');
            $('#victMiddleNameInput').removeAttr('readonly');
            $('#victLastNameInput').removeAttr('readonly');
            $('#victSexInput').removeAttr('disabled');
            $('#victDescInput').removeAttr('readonly');
            $('#victAgeInput').removeAttr('readonly');
            $('#victIdInput').removeAttr('disabled');

            $('#suspFirstNameInput').removeAttr('readonly');
            $('#suspMiddleNameInput').removeAttr('readonly');
            $('#suspLastNameInput').removeAttr('readonly');
            $('#suspSexInput').removeAttr('disabled');
            $('#suspSupervisedReleaseStatusInput').removeAttr('disabled');
            $('#suspDescInput').removeAttr('readonly');
            $('#suspAgeInput').removeAttr('readonly');
            $('#juvenileTriedAsAdultInput').removeAttr('disabled');
            $('#suspIdInput').removeAttr('disabled');

            $(save).removeAttr('disabled');
            // $(save).click(() => {
            //   $.ajax({
            //     url: `http://localhost:3000/cases?_id=${iD}`,
            //     data: formData,
            //     processData: false,
            //     contentType: false,
            //     type: 'POST',
            //     crossDomain: true,
            //     headers: {
            //       'x-access-token': token
            //     }
            //   }).done((data) => {
            //     caseData = data;
            //     fillData(caseData);
            //   }).fail(() => {
            //     console.log('FAILURE');
            //   });
            // })
            // be able to edit items and save changes in the database
          });

          $('#delete').click(() => {
            alert('Are you sure you want to delete this case?');
            // be able to delete a case from the database
            // redirect to the homepage

            // getting a 400 Bad Request
            // $.ajax({
            //   url: 'http://localhost:3000/cases/3',
            //   type: 'DELETE',
            //   headers: {
            //     'x-access-token': token,
            //   },
            //   success: function(result) {
            //     window.location.replace("http://localhost:3000/home");
            //   }
            // });
          });
        });
      });
    }
  };

})();
